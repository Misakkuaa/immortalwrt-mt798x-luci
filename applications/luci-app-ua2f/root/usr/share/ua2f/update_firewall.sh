#!/bin/sh

# 备份当前防火墙规则
if [ -f /etc/firewall.user ]; then
  cp /etc/firewall.user /etc/firewall.user.bak
fi

# 复制新规则
cp /usr/share/ua2f/firewall.user /etc/firewall.user

# 确保执行权限
chmod 755 /etc/firewall.user

# 重启防火墙
if /etc/init.d/firewall restart >/dev/null 2>&1; then
  echo "防火墙规则已成功更新"
  exit 0
else
  echo "防火墙重启失败" >&2
  exit 1
fi
