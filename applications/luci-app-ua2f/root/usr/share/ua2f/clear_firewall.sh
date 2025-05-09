#!/bin/sh

# 备份当前防火墙规则
if [ -f /etc/firewall.user ]; then
  cp /etc/firewall.user /etc/firewall.user.bak
fi

# 创建空的防火墙规则文件
cat > /etc/firewall.user << EOF
#!/bin/sh

# This file is interpreted as shell script.
# Put your custom iptables rules here, they will
