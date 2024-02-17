<script>
	export let icon = 'cube';
	export let width = '100%';
	export let height = '100%';
	export let isIconActive = false;
</script>

<div
	class="container"
	style:--bgColor={isIconActive ? 'hsla(0, 0%, 20%, .9)' : 'white'}
	style:--strokeColor={isIconActive ? 'white' : 'black'}
	style:--strokeWidth={icon === 'spiral' ? '3' : 'unset'}
	on:click
	style:width
	style:height
>
	{#if icon === 'discs'}
		<svg
			class="icon"
			{width}
			{height}
			viewBox="0 0 203 237"
			version="1.1"
			id="svg1"
			xml:space="preserve"
			inkscape:version="1.3 (0e150ed6c4, 2023-07-21)"
			sodipodi:docname="discs.svg"
			inkscape:export-filename="discs.svg"
			inkscape:export-xdpi="25.4"
			inkscape:export-ydpi="25.4"
			xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
			xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:svg="http://www.w3.org/2000/svg"
			><sodipodi:namedview
				id="namedview1"
				pagecolor="#ffffff"
				bordercolor="#666666"
				borderopacity="1.0"
				inkscape:showpageshadow="2"
				inkscape:pageopacity="0.0"
				inkscape:pagecheckerboard="0"
				inkscape:deskcolor="#d1d1d1"
				inkscape:document-units="mm"
				inkscape:zoom="1.4142136"
				inkscape:cx="453.25545"
				inkscape:cy="400.22244"
				inkscape:window-width="3360"
				inkscape:window-height="1780"
				inkscape:window-x="-12"
				inkscape:window-y="681"
				inkscape:window-maximized="1"
				inkscape:current-layer="layer2"
			/><defs id="defs1" /><g inkscape:groupmode="layer" id="layer2" inkscape:label="Layer 2"
				><ellipse
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.39073;stroke-linejoin:round;stroke-dasharray:none"
					id="path2"
					cx="145.58469"
					cy="127.87307"
					rx="52.788685"
					ry="49.640903"
					transform="matrix(0.99946187,0.03280195,0.02825868,0.99960064,0,0)"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.32547;stroke-linejoin:round;stroke-dasharray:none"
					id="path2-0"
					transform="matrix(0.9994844,0.03210829,-0.04133515,0.99914534,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="108.61262"
					sodipodi:cy="97.624619"
					sodipodi:rx="50.840439"
					sodipodi:ry="46.819153"
					sodipodi:start="1.6468456"
					sodipodi:end="5.836265"
					sodipodi:arc-type="arc"
					d="M 104.74996,144.30845 A 50.840439,46.819153 0 0 1 58.017484,102.21832 50.840439,46.819153 0 0 1 94.924665,52.534267 50.840439,46.819153 0 0 1 154.45963,77.389831"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.44777;stroke-linejoin:round;stroke-dasharray:none"
					id="path3"
					transform="matrix(0.99941851,0.03409749,0,1,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="50.380772"
					sodipodi:cy="101.44256"
					sodipodi:rx="49.624668"
					sodipodi:ry="46.981289"
					sodipodi:start="0.93765615"
					sodipodi:end="5.2186993"
					sodipodi:arc-type="arc"
					d="M 79.742655,139.31763 A 49.624668,46.981289 0 0 1 14.994672,134.38058 49.624668,46.981289 0 0 1 10.878148,73.00667 49.624668,46.981289 0 0 1 74.446442,60.355552"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.44777;stroke-linejoin:round;stroke-dasharray:none"
					id="path4"
					transform="matrix(0.99941851,0.03409749,0,1,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="50.380772"
					sodipodi:cy="101.44256"
					sodipodi:rx="49.624668"
					sodipodi:ry="46.981289"
					sodipodi:start="5.8643863"
					sodipodi:end="0.22633837"
					sodipodi:arc-type="arc"
					d="m 95.716777,82.336981 a 49.624668,46.981289 0 0 1 3.022967,29.648689"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.32547;stroke-linejoin:round;stroke-dasharray:none"
					id="path5"
					transform="matrix(0.9994844,0.03210829,-0.04133515,0.99914534,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="108.61262"
					sodipodi:cy="97.624619"
					sodipodi:rx="50.840439"
					sodipodi:ry="46.819153"
					sodipodi:start="0.24410281"
					sodipodi:end="0.96527928"
					sodipodi:arc-type="arc"
					d="M 157.94587,108.94014 A 50.840439,46.819153 0 0 1 137.55035,136.1197"
					sodipodi:open="true"
				/><ellipse
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.00107003;stroke-linejoin:round;stroke-dasharray:none"
					id="path6"
					cx="140.22171"
					cy="129.78989"
					rx="45.062832"
					ry="40.286339"
					transform="matrix(1,0,0.06533528,0.99786337,0,0)"
				/><ellipse
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.495726;stroke-linejoin:round;stroke-dasharray:none"
					id="path7"
					cx="133.254"
					cy="134.27505"
					rx="27.625048"
					ry="24.904961"
					transform="matrix(0.99939129,-0.03488635,0.11876353,0.99292257,0,0)"
				/><ellipse
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.00120493;stroke-linejoin:round;stroke-dasharray:none"
					id="path8"
					cx="139.8089"
					cy="129.0387"
					rx="22.826303"
					ry="20.73031"
					transform="matrix(1,0,0.06931982,0.99759449,0,0)"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.532574;stroke-linejoin:round;stroke-dasharray:none"
					id="path9"
					transform="matrix(0.99993878,0.01106493,0.12149913,0.99259154,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="132.10822"
					sodipodi:cy="130.85245"
					sodipodi:rx="22.351467"
					sodipodi:ry="18.80566"
					sodipodi:start="3.3679573"
					sodipodi:end="0.27744982"
					sodipodi:arc-type="arc"
					d="m 110.32696,126.63177 a 22.351467,18.80566 0 0 1 15.59988,-13.85153 22.351467,18.80566 0 0 1 21.96446,4.75629 22.351467,18.80566 0 0 1 5.7136,18.46686"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.00008;stroke-linejoin:round;stroke-dasharray:none"
					id="path10"
					transform="matrix(1,0,0.01745241,0.99984769,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="48.668373"
					sodipodi:cy="100.38834"
					sodipodi:rx="41.643002"
					sodipodi:ry="37.345818"
					sodipodi:start="1.1586495"
					sodipodi:end="5.203264"
					sodipodi:arc-type="arc"
					d="M 65.349615,134.60693 A 41.643002,37.345818 0 0 1 15.136308,122.53317 41.643002,37.345818 0 0 1 17.182194,75.947048 41.643002,37.345818 0 0 1 68.298791,67.452294"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.00008;stroke-linejoin:round;stroke-dasharray:none"
					id="path11"
					transform="matrix(1,0,0.01745241,0.99984769,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="48.668373"
					sodipodi:cy="100.38834"
					sodipodi:rx="41.643002"
					sodipodi:ry="37.345818"
					sodipodi:start="5.9520209"
					sodipodi:end="0.34383407"
					sodipodi:arc-type="arc"
					d="M 88.048677,88.245561 A 41.643002,37.345818 0 0 1 87.873973,112.97759"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.499537;stroke-linejoin:round;stroke-dasharray:none"
					id="path12"
					transform="matrix(1,0,0.01745241,0.99984769,0,0)"
					sodipodi:type="arc"
					sodipodi:cx="48.304813"
					sodipodi:cy="99.780228"
					sodipodi:rx="25.749001"
					sodipodi:ry="23.086794"
					sodipodi:start="1.2277405"
					sodipodi:end="5.1066501"
					sodipodi:arc-type="arc"
					d="M 56.965913,121.52178 A 25.749001,23.086794 0 0 1 27.361465,113.21104 25.749001,23.086794 0 0 1 28.155613,85.405907 25.749001,23.086794 0 0 1 58.195677,78.464638"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.998393;stroke-linejoin:round;stroke-dasharray:none"
					id="path13"
					sodipodi:type="arc"
					sodipodi:cx="51.142639"
					sodipodi:cy="99.250542"
					sodipodi:rx="22.107279"
					sodipodi:ry="19.13966"
					sodipodi:start="1.3333996"
					sodipodi:end="5.0404927"
					sodipodi:arc-type="arc"
					d="m 56.341678,117.8534 a 22.107279,19.13966 0 0 1 -23.781351,-8.23431 22.107279,19.13966 0 0 1 1.161229,-22.151756 22.107279,19.13966 0 0 1 24.54512,-6.335449"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.5;stroke-linejoin:round;stroke-dasharray:none"
					id="path14"
					sodipodi:type="arc"
					sodipodi:cx="49.578495"
					sodipodi:cy="103.78745"
					sodipodi:rx="20.659349"
					sodipodi:ry="17.993336"
					sodipodi:start="3.1359686"
					sodipodi:end="5.0238039"
					sodipodi:arc-type="arc"
					d="M 28.919472,103.88865 A 20.659349,17.993336 0 0 1 37.365407,89.274919 20.659349,17.993336 0 0 1 55.90864,86.659579"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.780645;stroke-linejoin:round;stroke-dasharray:none"
					id="path15"
					sodipodi:type="arc"
					sodipodi:cx="50.355206"
					sodipodi:cy="99.174286"
					sodipodi:rx="49.819427"
					sodipodi:ry="45.460903"
					sodipodi:start="1.0834953"
					sodipodi:end="2.9593624"
					sodipodi:open="true"
					sodipodi:arc-type="arc"
					d="M 73.682793,139.34353 A 49.819427,45.460903 0 0 1 28.657101,140.09691 49.819427,45.460903 0 0 1 1.3606899,107.41286"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.958165;stroke-linejoin:round;stroke-dasharray:none"
					id="path16"
					sodipodi:type="arc"
					sodipodi:cx="104.25517"
					sodipodi:cy="98.736038"
					sodipodi:rx="43.502888"
					sodipodi:ry="38.07732"
					sodipodi:start="1.7508575"
					sodipodi:end="5.8589785"
					sodipodi:open="true"
					sodipodi:arc-type="arc"
					d="M 96.464251,136.19775 A 43.502888,38.07732 0 0 1 60.76221,99.549365 43.502888,38.07732 0 0 1 94.643392,61.599758 43.502888,38.07732 0 0 1 143.9022,83.063489"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.958165;stroke-linejoin:round;stroke-dasharray:none"
					id="path17"
					sodipodi:type="arc"
					sodipodi:cx="104.25517"
					sodipodi:cy="98.736038"
					sodipodi:rx="43.502888"
					sodipodi:ry="38.07732"
					sodipodi:start="0.39155812"
					sodipodi:end="1.0384287"
					sodipodi:arc-type="arc"
					d="m 144.46557,113.26745 a 43.502888,38.07732 0 0 1 -18.12943,18.2763"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.497333;stroke-linejoin:round;stroke-dasharray:none"
					id="path18"
					sodipodi:type="arc"
					sodipodi:cx="104.62934"
					sodipodi:cy="97.753822"
					sodipodi:rx="26.488157"
					sodipodi:ry="23.26088"
					sodipodi:start="1.8299106"
					sodipodi:end="5.7595481"
					sodipodi:arc-type="arc"
					d="M 97.842426,120.23819 A 26.488157,23.26088 0 0 1 78.141227,97.795759 26.488157,23.26088 0 0 1 97.750149,75.29109 26.488157,23.26088 0 0 1 127.56825,86.122608"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.760744;stroke-linejoin:round;stroke-dasharray:none"
					id="path19"
					sodipodi:type="arc"
					sodipodi:cx="104.58257"
					sodipodi:cy="98.081238"
					sodipodi:rx="21.478369"
					sodipodi:ry="19.747797"
					sodipodi:start="1.8497689"
					sodipodi:end="5.7236607"
					sodipodi:arc-type="arc"
					d="M 98.668116,117.06556 A 21.478369,19.747797 0 0 1 83.104207,98.091635 21.478369,19.747797 0 0 1 98.646377,79.10265 21.478369,19.747797 0 0 1 122.78565,87.599436"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.623125;stroke-linejoin:round;stroke-dasharray:none"
					id="path20"
					sodipodi:type="arc"
					sodipodi:cx="103.88098"
					sodipodi:cy="99.110222"
					sodipodi:rx="21.219772"
					sodipodi:ry="15.139393"
					sodipodi:start="3.0677672"
					sodipodi:end="5.5552122"
					sodipodi:arc-type="arc"
					d="M 82.719009,100.22688 A 21.219772,15.139393 0 0 1 95.60004,85.171225 21.219772,15.139393 0 0 1 119.72206,89.037108"
					sodipodi:open="true"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.33509;stroke-linejoin:round;stroke-dasharray:none"
					id="path21"
					sodipodi:type="arc"
					sodipodi:cx="105.37668"
					sodipodi:cy="99.25695"
					sodipodi:rx="51.445953"
					sodipodi:ry="44.576431"
					sodipodi:start="1.7205402"
					sodipodi:end="3.1484324"
					sodipodi:open="true"
					sodipodi:arc-type="arc"
					d="M 97.70172,143.33454 A 51.445953,44.576431 0 0 1 53.931928,98.952061"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:1.31011;stroke-linejoin:round;stroke-dasharray:none"
					id="path22"
					sodipodi:type="arc"
					sodipodi:cx="107.89782"
					sodipodi:cy="96.402977"
					sodipodi:rx="46.177376"
					sodipodi:ry="47.821541"
					sodipodi:start="0.36163853"
					sodipodi:end="1.0735603"
					sodipodi:open="true"
					sodipodi:arc-type="arc"
					d="m 151.08837,113.32259 a 46.177376,47.821541 0 0 1 -21.16403,25.11095"
				/><path
					style="fill:#000000;fill-opacity:0;stroke:#000000;stroke-width:0.769292;stroke-linejoin:round;stroke-dasharray:none"
					id="path23"
					sodipodi:type="arc"
					sodipodi:cx="139.28447"
					sodipodi:cy="129.80867"
					sodipodi:rx="53.223381"
					sodipodi:ry="47.603809"
					sodipodi:start="0.1226872"
					sodipodi:end="2.9815881"
					sodipodi:open="true"
					sodipodi:arc-type="arc"
					d="m 192.10779,135.63441 a 53.223381,47.603809 0 0 1 -51.8303,41.76978 53.223381,47.603809 0 0 1 -53.536556,-40.01115"
					transform="matrix(1,0,0.07063314,0.99750237,0,0)"
				/></g
			></svg
		>
	{:else if icon === 'sphere'}
		<svg
			class="icon"
			{width}
			{height}
			viewBox="0 0 203 237"
			version="1.1"
			id="svg1"
			xml:space="preserve"
			inkscape:version="1.3.1 (91b66b0783, 2023-11-16)"
			sodipodi:docname="spiral.svg"
			xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
			xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:svg="http://www.w3.org/2000/svg"
			><sodipodi:namedview
				id="namedview1"
				pagecolor="#ffffff"
				bordercolor="#666666"
				borderopacity="1.0"
				inkscape:showpageshadow="2"
				inkscape:pageopacity="0.0"
				inkscape:pagecheckerboard="0"
				inkscape:deskcolor="#d1d1d1"
				inkscape:document-units="mm"
				inkscape:zoom="1.7890873"
				inkscape:cx="285.34102"
				inkscape:cy="439.33015"
				inkscape:window-width="3360"
				inkscape:window-height="1780"
				inkscape:window-x="-12"
				inkscape:window-y="681"
				inkscape:window-maximized="1"
				inkscape:current-layer="layer3"
			/><defs id="defs1" /><g inkscape:groupmode="layer" id="layer3" inkscape:label="Layer 2"
				><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 96.59402,39.771367 c 0,0 0.387659,8.222965 -2.690789,12.177884 M 77.302879,68.623547 c -7.024648,7.616197 -51.043676,26.266146 -66.080948,11.19915 l -0.08183,-3.564786 c 0,0 10.454312,-10.998785 13.87905,-21.717428 0,0 6.300198,-7.953601 39.344991,-5.7053 L 83.919134,38.064254 72.311627,36.600246 c 0,0 -22.430721,3.660024 -22.535293,2.300586 0,0 -4.812088,-2.688869 -3.032593,-3.660026 18.574576,-10.137047 32.051358,-12.33951 32.051358,-12.33951 5.790523,-0.328036 2.980647,-0.697847 16.77114,1.317117 0,0 2.330999,-8.029681 27.619731,-0.06225 0,0 31.11021,8.104339 50.92663,32.835648 0,0 17.20211,22.587581 19.65956,44.129439 0,0 3.03258,27.55475 0.52285,31.05792 0,0 -10.03892,33.09708 -11.65979,32.73108 0,0 -18.40469,25.98617 -24.78359,27.55475 -3.29403,4.86261 -48.10318,26.35218 -56.52124,20.44385 0,0 -17.306686,0.83658 -15.162957,-3.76459 0,0 -18.195549,2.30058 -25.724742,-3.7646 -4.705746,-4.96718 -25.097312,-13.59437 -24.888168,-16.41782 0,0 -3.294022,0.52286 0.05229,-8.31348 0,0 -14.640097,-3.81689 -17.934119,-12.28723 0.156858,-7.21548 -2.509731,-9.35921 -10.5617852,-20.80986 0,0 -3.5031667,-3.92145 6.9017602,-12.65322 0,0 -10.1957822,-3.34632 -11.607506,-10.45722 0,0 1.9868704,-5.17632 3.4508802,-12.33951 -0.052286,-6.11747 -2.3005869,-12.02579 -2.3005869,-12.02579 0,0 22.0647197,-28.286763 92.9646237,-9.620638 0,0 11.53357,-7.336214 14.81335,-12.843343 1.00807,-1.692668 -29.975036,-7.459416 -33.89405,-8.901318"
					id="path1"
					sodipodi:nodetypes="ccccccccccsccccccccccccccccccccsc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 96.544277,39.794376 c 0,0 11.146253,2.311121 16.071923,4.017242 1.14901,0.397988 5.73064,9.578055 6.28521,15.084507 0.0877,0.8713 -8.48504,-4.676936 -24.99296,-6.987675"
					id="path2"
					sodipodi:nodetypes="cssc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M 116.31338,29.614436 C 138.478,35.529929 155.79929,47.28697 155.79929,47.28697 133.02464,25.824822 116.33187,29.503521 116.33187,29.503521"
					id="path3"
					sodipodi:nodetypes="ccc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 149.8838,60.079225 c 0,0 10.97342,9.737115 20.0757,14.455987 0.32868,0.170399 -0.3617,13.614572 -1.22007,13.383802 -0.97288,-0.261557 -14.82731,-12.881871 -18.85563,-14.49296 -0.91643,-0.366519 -0.33275,-13.420772 -0.33275,-13.420772"
					id="path4"
					sodipodi:nodetypes="csssc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 187.00538,99.21708 c 0,0 3.27706,7.59773 4.10201,11.62447 0.19384,0.94618 -1.46816,9.86158 -2.36619,10.01936 -0.94415,0.16588 -4.39965,-10.79577 -4.39965,-10.79577 l 2.498,-10.842103"
					id="path5"
					sodipodi:nodetypes="csscc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 141.82394,91.468309 c 0,0 12.08424,7.807045 18.33803,15.565141 0.30667,0.38044 -7.25117,8.53014 -10.22403,12.7064 -0.25925,0.36419 -15.12673,-13.7762 -18.54005,-14.99865 -1.95917,-0.70166 10.5,-12.829229 10.5,-12.829229"
					id="path6"
					sodipodi:nodetypes="csssc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 174.42631,129.61715 c 0.74682,-0.81905 3.19934,14.65941 2.98031,14.95382 -3.73261,5.01733 -12.53918,14.86599 -12.86346,14.20332 -0.31605,-0.64585 -1.41514,-14.85539 -2.03807,-16.60848 -0.63066,-1.77483 7.77532,-8.00178 11.92122,-12.54866 z"
					id="path7"
					sodipodi:nodetypes="sssss"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 82.559696,131.23802 c 0,0 20.232724,-8.01861 26.509034,-11.55522 0.59319,-0.33425 14.58358,7.54731 20.44385,15.31982 0.55612,0.73759 -17.08852,7.87287 -21.33271,11.18922 -0.45942,0.35899 -9.672926,-10.61408 -25.358745,-14.53553"
					id="path8"
					sodipodi:nodetypes="csssc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 28.077617,156.64905 c 0,0 12.616538,-5.3976 19.293557,-5.38547 10.680271,0.0194 18.614748,1.41128 26.352177,4.54889 2.640479,1.07074 -17.195744,1.74554 -23.058154,3.92146 -1.272245,0.47221 -23.162728,-3.34631 -23.162728,-3.34631"
					id="path9"
					sodipodi:nodetypes="csssc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 113.90519,204.90909 c 38.53483,-12.9408 53.98536,-28.96648 53.98536,-28.96648 -15.33517,19.30356 -36.43942,30.23409 -53.95922,29.09719"
					id="path10"
					sodipodi:nodetypes="ccc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 117.32993,169.92971 c 0,0 23.04708,-11.68411 23.16273,-10.82322 0.95947,7.14225 -3.2221,17.1632 -10.39705,21.9654 -6.28651,4.20758 -26.04634,9.61538 -26.04634,9.61538 0,0 -40.952111,7.18518 -38.945236,4.34763 1.573381,-2.22463 22.043513,-1.33696 31.856624,-3.78779 3.924202,-0.98007 -3.924464,-9.3652 -12.361805,-11.01705 -2.400425,-0.46995 8.870295,-0.95124 12.182652,-4.23517 1.648041,-1.6339 4.110935,11.0059 6.588045,12.07808 0,0 10.65303,0.71916 13.64775,-17.95161"
					id="path11"
					sodipodi:nodetypes="csscsssscc"
				/><path
					style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 28.985916,109.43662 c 8.825677,-2.71024 24.589237,-3.39006 24.401407,-2.58803 -0.536492,2.2908 -24.382828,2.55586 -24.382828,2.55586"
					id="path12"
					sodipodi:nodetypes="csc"
				/></g
			></svg
		>
	{:else}
		<svg
			class="icon"
			{width}
			{height}
			viewBox="0 0 53.641426 62.828476"
			version="1.1"
			id="svg1"
			inkscape:export-filename="bitmap.svg"
			inkscape:export-xdpi="96"
			inkscape:export-ydpi="96"
			xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
			xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:svg="http://www.w3.org/2000/svg"
		>
			<sodipodi:namedview
				id="namedview1"
				pagecolor="#ffffff"
				bordercolor="#666666"
				borderopacity="1.0"
				inkscape:showpageshadow="2"
				inkscape:pageopacity="0.0"
				inkscape:pagecheckerboard="0"
				inkscape:deskcolor="#d1d1d1"
				inkscape:document-units="mm"
			/>
			<defs id="defs1" />
			<g
				inkscape:groupmode="layer"
				id="layer2"
				inkscape:label="Layer 1"
				style="display:inline"
				transform="translate(-1.8314135,-10.644594)"
			>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 1.9689557,29.277083 4.0796697,28.608694 21.5712576,15.45175 3.36572,-0.25498 20.19437,-15.961714 4.13067,-27.945742 -2.03984,-3.314731 -15.64706,-4.256784 c -5.91758,0.884695 -11.85889,0.891146 -17.82454,-0.0031 L 3.7538117,26.26832 Z"
					id="path108"
					sodipodi:nodetypes="ccccccccccc"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 1.9689557,29.514032 26.3138673,10.607143 3.46772,-0.152987 23.5091,-11.219093 -1.58087,-1.835852 L 32.260503,37.3674 27.517893,37.21441 3.0908647,27.372206"
					id="path109"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 27.874863,39.764205 0.30597,33.198322 2.39681,0.15298 0.66294,-33.351302"
					id="path110"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 15.584853,26.70926 c 0,0 13.15694,9.077268 25.49794,-0.051"
					id="path111"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 7.1371438,16.455753 c 0,0 1.3158441,-5.678868 21.1938292,-5.678868 19.87797,0 21.68095,5.714928 21.68095,5.714928 0,0 -2.92403,5.73973 -21.42096,5.73973 -18.496939,0 -21.4538192,-5.487314 -21.4538192,-5.487314"
					id="path112"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 20.208723,21.810593 c 0,0 -4.301915,2.989219 -4.782396,4.782396 -0.48048,1.793177 -0.662594,1.74438 -0.662594,1.74438"
					id="path113"
				/>
				<path
					style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="m 37.102613,21.684385 c 0,0 4.91164,3.659569 4.45335,4.453352 -0.45829,0.793784 0.63104,-0.631042 -0.0361,0.03606"
					id="path114"
				/>
			</g>
		</svg>
	{/if}
</div>

<style>
	.container {
		--bgColor: white;
		--strokeColor: black;
		--strokeWidth: unset;
		background-color: var(--bgColor);
		border-radius: 100%;
		box-shadow: inset 0 0 0 4px black;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon {
		max-width: 60%;
	}

	.icon path,
	.icon ellipse {
		stroke: var(--strokeColor) !important;
		stroke-width: var(--strokeWidth) !important;
	}
</style>
