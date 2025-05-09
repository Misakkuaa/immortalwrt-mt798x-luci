# SPDX-License-Identifier: Apache-2.0
#
# Copyright (C) 2024 ImmortalWrt.org

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for ua2f
LUCI_DEPENDS:=+ua2f +iptables-mod-nfqueue +iptables-mod-nat-extra +iptables-mod-ipopt +kmod-ipt-ipopt +kmod-rkp-ipid

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Tianling Shen <cnsztl@immortalwrt.org>

include ../../luci.mk

define KernelPackage/existing-package
  # ... 现有配置 ...
  KCONFIG+= \
    CONFIG_NETFILTER_NETLINK_GLUE_CT=y
endef
# call BuildPackage - OpenWrt buildroot signature

define Package/luci-app-ua2f/postinst
#!/bin/sh
chmod 755 /usr/libexec/rpcd/ua2f
chmod 644 /usr/share/ua2f/firewall.user
if [ -f "/etc/uci-defaults/40_luci-app-ua2f" ]; then
	( . /etc/uci-defaults/40_luci-app-ua2f ) && rm -f /etc/uci-defaults/40_luci-app-ua2f
fi
exit 0
endef
