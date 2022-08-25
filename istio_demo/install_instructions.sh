#create a configmap to store protofiles
kubectl delete configmap myshop.proto 
kubectl create configmap myshop.proto --from-file="./protos/myshop.proto" 
kubectl delete -f ./k8s/
kubectl apply -f ./k8s/