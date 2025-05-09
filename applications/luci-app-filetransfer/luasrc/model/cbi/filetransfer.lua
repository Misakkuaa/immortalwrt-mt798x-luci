local fs = require "luci.fs"
local http = luci.http

ful = SimpleForm("upload", translate("Upload"), nil)
ful.reset = false
ful.submit = false

sul = ful:section(SimpleSection, "", translate("Upload file to '/etc/mentohust/'"))

fu = sul:option(FileUpload, "")
fu.template = "filetransfer/other_upload"

um = sul:option(DummyValue, "", nil)
um.template = "filetransfer/other_dvalue"

local dir, fd
dir = "/etc/mentohust/"
nixio.fs.mkdir(dir)
http.setfilehandler(
	function(meta, chunk, eof)
		if not fd then
			if not meta then return end

			if	meta and chunk then fd = nixio.open(dir .. meta.file, "w") end

			if not fd then
				um.value = translate("Create upload file error.")
				return
			end
		end
		if chunk and fd then
			fd:write(chunk)
		end
		if eof and fd then
			fd:close()
			fd = nil
			um.value = translate("File saved to") .. ' "/etc/mentohust/' .. meta.file .. '"'
		end
	end
)

if luci.http.formvalue("upload") then
	local f = luci.http.formvalue("ulfile")
	if #f <= 0 then
		um.value = translate("No specify upload file.")
	end
end

return ful
