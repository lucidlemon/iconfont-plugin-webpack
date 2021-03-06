'use strict';

const TEMPLATE = `
@function iconfont-item($name) {
	$slash: str-index($name, '/');
	$group: null;
	@if ($slash) {
		$group: str-slice($name, 0, $slash - 1);
		$name: str-slice($name, $slash + 1);
	} @else {
		$group: nth(map-keys($__iconfont__data), 1);
	}
	$group: iconfont-group($group);
	@if (false == map-has-key($group, $name)) {
		@warn 'Undefined Iconfont Glyph!';
		@return '';
	}
	@return map-get($group, $name);
}

@function iconfont-group($group: null) {
	@if (null == $group) {
		$group: nth(map-keys($__iconfont__data), 1);
	}
	@if (false == map-has-key($__iconfont__data, $group)) {
		@warn 'Undefined Iconfont Family!';
		@return ();
	}
	@return map-get($__iconfont__data, $group);
}`;

function toSCSS(glyphs) {
	return JSON.stringify(glyphs, null, '\t')
		.replace(/\{/g, '(')
		.replace(/\}/g, ')')
		.replace(/\\\\/g, '\\');
}

module.exports = function(args) {
	const family = args.family;
	const glyphs = args.unicodes.reduce(function(glyphs, glyph) {
		glyphs[glyph.name] = '\\' + glyph.unicode.charCodeAt(0).toString(16).toLowerCase();
		return glyphs;
	}, {});
	const data = {};
	data[family] = glyphs;

	return [
		`$__iconfont__data: map-merge(if(global_variable_exists('__iconfont__data'), $__iconfont__data, ()), ${toSCSS(data)});`,
		TEMPLATE
	].join('\n\n');
};