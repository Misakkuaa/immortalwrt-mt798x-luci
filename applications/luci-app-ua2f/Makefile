# SPDX-License-Identifier: Apache-2.0
#
# Copyright (C) 2024 ImmortalWrt.org

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for ua2f
LUCI_DEPENDS:=+ua2f +iptables-mod-nfqueue +iptables-mod-nat-extra +iptables-mod-ipopt +kmod-ipt-ipopt +kmod-rkp-ipid

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Tianling Shen <cnsztl@immortalwrt.org>

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
