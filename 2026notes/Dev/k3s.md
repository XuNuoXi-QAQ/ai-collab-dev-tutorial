好的，我为你整理了一份 **k3s 从零到部署应用的完整教程**，专门针对你在 VMware 里那台 Manjaro 虚拟机。  
所有步骤都经过精简，照着敲命令就行。

---

## k3s 极简上手指南（Manjaro 虚拟机环境）

### 1. 什么是 k3s？
k3s 是一个打包好的轻量级 Kubernetes 发行版，把控制平面、容器运行时、kubectl 全部整合到一起。  
**一条命令就能在你的 Manjaro 虚拟机上跑起一个完整的 K8s 集群**，不需要手动安装 kubeadm/kubelet 等组件。

---

### 2. 准备工作
- 一台 Manjaro 虚拟机（推荐 ≥ 2 vCPU，2 GB 内存）
- 能正常访问网络
- **不需要**手动关闭 swap 或调整 cgroup，k3s 安装脚本会自动处理

---

### 3. 安装 k3s
打开终端，执行：
```bash
curl -sfL https://get.k3s.io | sh -
```
稍等片刻，安装完成后检查集群状态：
```bash
sudo kubectl get nodes
```
看到节点状态为 `Ready` 即表示成功。

---

### 4. 让 kubectl 不用每次都加 sudo
默认只有 root 能操作集群。把配置文件复制到你的用户目录：
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```
现在可以直接用 `kubectl get nodes` 了。

---

### 5. 运行你的第一个应用（Nginx）
创建一个 Nginx 部署：
```bash
kubectl create deployment my-nginx --image=nginx
```
查看 Pod 是否跑起来：
```bash
kubectl get pods
```
等到 `STATUS` 变为 `Running`。

---

### 6. 把应用暴露出来，让浏览器能访问
k3s 自带一个轻量级的 LoadBalancer 控制器（ServiceLB），可以直接使用 `LoadBalancer` 类型的 Service。

暴露服务：
```bash
kubectl expose deployment my-nginx --port=80 --type=LoadBalancer
```
查看分配到的端口：
```bash
kubectl get svc my-nginx
```
你会看到类似 `EXTERNAL-IP` 显示为 `pending`，但 `PORT(S)` 里会有一个映射的端口，如 `80:30001/TCP`。  
用虚拟机的 IP 地址加上这个端口就能在浏览器访问：
```
http://你的虚拟机IP:30001
```

如果你使用 VMware NAT 模式，在宿主机浏览器直接访问这个地址即可。  
如果是桥接模式，也是同样方式。

---

### 7. 部署你自己的应用，并把 .env 文件变成 Secret
假设你有一个应用需要数据库密码等配置，原本在 `.env` 文件里：
```
DB_HOST=10.0.0.5
DB_PASS=MySecret123
```
把它做成 k8s Secret：
```bash
kubectl create secret generic my-app-config --from-env-file=./.env
```
然后在 Pod 清单里注入环境变量，写一个 `deploy.yaml`：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: your-docker-image:tag   # 替换成你的镜像
        envFrom:
        - secretRef:
            name: my-app-config
```
创建它：
```bash
kubectl apply -f deploy.yaml
```
这样容器里就会自动拥有 `DB_HOST`、`DB_PASS` 环境变量，和本地开发时加载 `.env` 的效果一样。

---

### 8. 常用管理命令
```bash
# 查看所有 Pod
kubectl get pods

# 查看所有 Service
kubectl get svc

# 查看 Pod 日志
kubectl logs pod名称

# 进入容器执行命令
kubectl exec -it pod名称 -- /bin/sh

# 删除一个部署
kubectl delete deployment my-nginx

# 删除一个 Service
kubectl delete svc my-nginx
```

---

### 9. 如何卸载 k3s
如果环境搞乱了想重来，可以干净卸载：
```bash
/usr/local/bin/k3s-uninstall.sh
```
这会移除所有组件和数据。

---

### 10. 下一步
- 学习用 `kubectl apply -f` 管理多个 YAML 文件
- 尝试用 Helm（k3s 自带 `helm` 命令）
- 部署一个带持久化存储的应用（k3s 自带 local-path 存储）

现在你的 Manjaro 虚拟机里已经有一个完全可用的 Kubernetes 环境了，可以开始跑任何你想测试的容器应用。  
如果某个步骤卡住，直接告诉我，我帮你排错。
