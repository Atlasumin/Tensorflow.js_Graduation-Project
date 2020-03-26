
(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'),
		$nav_links = $nav.children('a');

	// Breakpoints.响应式对应的断点
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// 页面加载时播放初始动画
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav导航的控制
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// 没有可用链接时直接释放
					if (href.charAt(0) != '#' || $panels.filter(href).length == 0)
						return;

				// 点击到当前页面的标签时不做更改
					event.preventDefault();
					event.stopPropagation();

				// 切换到点击的相应标签页面
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// 页面部分的控制

		// 初始化
			(function() {

				var $panel, $link;

				// 获取页面，链接
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// 没有页面或链接 先初始化
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// 停用除该页面以外的页面
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// 激活链接
					$link
						.addClass('active');

				// 重制滚动
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// 获取页面，链接
					if (window.location.hash) {

						//改变当前页面的锚链，在页面内切换位置
				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// 点击的没有对应锚链就释放
							if ($panel.length == 0)
								return;

					}

				// 没有页面和链接，先进行初始化。
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// 停用所有页面
					$panels.addClass('inactive');

				// 停用所有链接
					$nav_links.removeClass('active');

				// 激活目标链接
					$link.addClass('active');

				// 设置最高/最低高度
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// 隐藏所有页面
							$panels.hide();

						// 显示目标页面
							$panel.show();

						// 设置新的最大/最小高度
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// 重制滚动
							$window.scrollTop(0);

						// Delay
							window.setTimeout(function() {

								// 激活目标页面
									$panel.removeClass('inactive');

								// 清理掉最大/最小高度
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: 刷新
									$window.triggerHandler('--refresh');

								// 解锁
									locked = false;
								// 检测页面大小进行响应式变化
							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// 兼容IE，直接固定参数。
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);