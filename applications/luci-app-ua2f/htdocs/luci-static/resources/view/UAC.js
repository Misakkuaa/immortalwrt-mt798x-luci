'use strict';
'require form';
'require poll';
'require rpc';
'require uci';
'require view';
'require ui';
'require fs';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: { '': {} }
});

var callUpdateFirewall = rpc.declare({
	object: 'ua2f',
	method: 'update_firewall',
	expect: { '': {} }
});

function getServiceStatus() {
	return L.resolveDefault(callServiceList('ua2f'), {}).then(function (res) {
		var isRunning = false;
		try {
			isRunning = res['ua2f']['instances']['ua2f']['running'];
		} catch (e) { }
		return isRunning;
	});
}

function renderStatus(isRunning) {
	var spanTemp = '<em><span style="color:%s"><strong>%s %s</strong></span></em>';
	var renderHTML;
	if (isRunning) {
		renderHTML = spanTemp.format('green', _('防检测'), _('RUNNING'));
	} else {
		renderHTML = spanTemp.format('red', _('防检测'), _('NOT RUNNING'));
	}

	return renderHTML;
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('ua2f')
		]);
	},

	render: function(data) {
		var m, s, o;

		m = new form.Map('ua2f', _('UA2F'), _('如开启此项防检测失效，请联系店家更换付费防检测'));

		s = m.section(form.TypedSection);
		s.anonymous = true;
		s.render = function () {
			poll.add(function () {
				return L.resolveDefault(getServiceStatus()).then(function (res) {
					var view = document.getElementById('service_status');
					view.innerHTML = renderStatus(res);
				});
			});

			return E('div', { class: 'cbi-section', id: 'status_bar' }, [
					E('p', { id: 'service_status' }, _('Collecting data…'))
			]);
		}

		s = m.section(form.NamedSection, 'enabled', 'ua2f');

		o = s.option(form.Flag, 'enabled', _('Enable'));

		s = m.section(form.NamedSection, 'firewall', 'ua2f');

		o = s.option(form.Flag, 'handle_fw', _('Auto setup firewall rules'));

		o = s.option(form.Flag, 'handle_tls', _('Process HTTP traffic from 443 port'));
		o.depends('handle_fw', '1');

		o = s.option(form.Flag, 'handle_intranet', _('Process HTTP traffic from Intranet'));
		o.depends('handle_fw', '1');

		// 修改成使用内置命令直接执行更新
		o = s.option(form.Button, '_update_firewall', _('一键修改防火墙'));
		o.inputtitle = _('应用防火墙规则');
		o.inputstyle = 'apply';
		o.onclick = function() {
			ui.showModal(_('更新防火墙规则'), [
				E('p', _('正在应用防火墙规则...')),
				E('div', { 'class': 'right' }, [
					E('div', { 'class': 'spinner' }, [
						E('div', { 'class': 'bubble1' }),
						E('div', { 'class': 'bubble2' }),
						E('div', { 'class': 'bubble3' })
					])
				])
			]);

			// 使用系统命令直接执行防火墙更新，但不显示结果提示
			return fs.exec_direct('/bin/sh', ['/usr/share/ua2f/update_firewall.sh']).then(function(res) {
				ui.hideModal();
				// 移除通知显示
			}).catch(function(err) {
				ui.hideModal();
				// 移除错误通知显示
			});
		};

		// 添加清空防火墙规则按钮
		o = s.option(form.Button, '_clear_firewall', _('清空防火墙规则'));
		o.inputtitle = _('清空防火墙规则');
		o.inputstyle = 'reset';
		o.onclick = function() {
			ui.showModal(_('清空防火墙规则'), [
				E('p', _('正在清空防火墙规则...')),
				E('div', { 'class': 'right' }, [
					E('div', { 'class': 'spinner' }, [
						E('div', { 'class': 'bubble1' }),
						E('div', { 'class': 'bubble2' }),
						E('div', { 'class': 'bubble3' })
					])
				])
			]);

			// 使用系统命令直接执行清空防火墙规则，但不显示结果提示
			return fs.exec_direct('/bin/sh', ['/usr/share/ua2f/clear_firewall.sh']).then(function(res) {
				ui.hideModal();
				// 移除通知显示
			}).catch(function(err) {
				ui.hideModal();
				// 移除错误通知显示
			});
		};

		s = m.section(form.NamedSection, 'main', 'ua2f');

		o = s.option(form.Value, 'custom_ua', _('Custom User-Agent'));

		o = s.option(form.Button, '_check_ua', _('Check User-Agent'));
		o.inputtitle = _('Open website');
		o.inputstyle = 'apply';
		o.onclick = function () {
			window.open('http://ua-check.stagoh.com/', '_blank');
		}

		return m.render();
	}
});
