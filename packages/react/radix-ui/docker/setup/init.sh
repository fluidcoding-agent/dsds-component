#!/bin/bash
base_dir=/setup
conf_dir=$base_dir/conf
cert_dir=$base_dir/certs
docker_client_ver=24.0.4

_hd="
[*]"
_tl="
"
dns_conf="nameserver 12.26.2.228"
proxy_ip_port="12.26.204.100:8080"
no_proxy="127.0.0.1,::1,localhost,samsung.com,samsungds.net,*.samsung.com,*.samsungds.net,12.0.0.0/8,10.0.0.0/8,192.0.0.0/8,172.0.0.0/8"
env_proxy_conf="
http_proxy=http://${proxy_ip_port}
https_proxy=http://${proxy_ip_port}
no_proxy=${no_proxy}
"
export_proxy_conf="
export http_proxy=http://${proxy_ip_port}
export https_proxy=http://${proxy_ip_port}
export no_proxy=${no_proxy}
"
apt_proxy_conf="
Acquire::http::Proxy \"http://${proxy_ip_port}\";
Acquire::https::Proxy \"http://${proxy_ip_port}\";
"


#######################################################################
# Copy config files
#######################################################################
IFS=' ' read -r -a array <<< ".gitconfig .npmrc"

for file in "${array[@]}"
do
  cp $conf_dir/$file $HOME
  chmod 644 $HOME/$file
done

mkdir -p $HOME/.pip
cp $conf_dir/.pip/pip.conf $HOME/.pip
chmod 644 $HOME/.pip/pip.conf


#######################################################################
# Init global proxy environment
#######################################################################
echo "$_hd Init global proxy environment...$_tl"

if grep -q "proxy" "/etc/environment"; then
  echo "proxy already installed in /etc/environment"
else
  echo "$env_proxy_conf" | tee -a /etc/environment > /dev/null
fi

if grep -q "export http_proxy" "/etc/environment"; then
  echo "proxy already installed in /etc/environment"
else
  echo "$export_proxy_conf" | tee -a /etc/environment > /dev/null
fi

if grep -q "export http_proxy" "/etc/profile"; then
  echo "proxy already installed in /etc/profile"
else
  echo "$export_proxy_conf" | tee -a /etc/profile > /dev/null
fi

source /etc/profile

#######################################################################
# Update system settings related to proxy
#######################################################################
echo "$_hd Update network and apt settings for proxy... $_tl"
echo "Update /etc/resolve.conf"
echo "$dns_conf" > /etc/resolv.conf
echo "Update proxy config for apt"
touch /etc/apt/apt.conf.d/proxy.conf
echo "$apt_proxy_conf" > /etc/apt/apt.conf.d/proxy.conf

#######################################################################
# Update root certificates
#######################################################################
echo "$_hd Update root certificate... $_tl"
mkdir -p /usr/local/share/ca-certificates/
cp $cert_dir/samsungsemi-prx.crt /usr/local/share/ca-certificates/
update-ca-certificates
apt update -y

