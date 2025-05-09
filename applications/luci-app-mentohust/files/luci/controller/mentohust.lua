module("luci.controller.mentohust", package.seeall)

function index()
    if not nixio.fs.access("/etc/config/mentohust") then
        return
    end
    if luci.sys.call("command -v mentohust >/dev/null") ~= 0 then
        return
    end
    entry({"admin", "services", "mentohust"},
        alias("admin", "services", "mentohust", "general"),
        _("MentoHUST"), 10).dependent = true

    entry({"admin", "services", "mentohust", "general"}, cbi("mentohust/general"), _("MentoHUST Settings"), 10).leaf = true
    entry({"admin", "services", "mentohust", "log"}, cbi("mentohust/log"), _("MentoHUST LOG"), 20).leaf = true
    
    -- 添加停止MentoHUST的路由
    entry({"admin", "services", "mentohust", "stop"}, call("stop_mentohust")).leaf = true
end

-- 添加停止MentoHUST的函数
function stop_mentohust()
    luci.sys.call("mentohust -k > /dev/null 2>&1")
    luci.http.redirect(luci.dispatcher.build_url("admin", "services", "mentohust", "general"))
end

