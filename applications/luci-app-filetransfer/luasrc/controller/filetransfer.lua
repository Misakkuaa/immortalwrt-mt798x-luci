--[[
luci-app-filetransfer
Description: File upload / download
Author: yuleniwo  xzm2@qq.com  QQ:529698939
Modify: ayongwifi@126.com  www.openwrtdl.com
]]--

module("luci.controller.filetransfer", package.seeall)

function index()
	local page = entry({"admin", "services", "filetransfer"}, form("filetransfer"), _("Ruijie File Upload"), 89)
	page.dependent = true
	page.acl_depends = { "luci-app-filetransfer" }
end
