<header class="header">
	<ul class="headerList">
		<a href="#" class="headerLink">
			<li class="headerItem">Home</li>
		</a>
		<a href="#" class="headerLink">
			<li class="headerItem">Shop</li>
		</a>
		<a href="#" class="headerLink">
			<li class="headerItem">Contact Us</li>
		</a>
		<li class="social">
			<ul class="socialList">
				<li class="socialItem">
					<a href="#" class="socialLink">
						<i class="fab fa-facebook-f" />
					</a>
				</li>
				<li class="socialItem">
					<a href="#" class="socialLink">
						<i class="fab fa-twitter" />
					</a>
				</li>
				<li class="socialItem">
					<a href="#" class="socialLink">
						<i class="fab fa-instagram" />
					</a>
				</li>
				<li class="socialItem">
					<a href="#" class="socialLink">
						<i class="fab fa-youtube" />
					</a>
				</li>
				<li class="socialItem">
					<a href="#" class="socialLink">
						<i class="fab fa-patreon" />
					</a>
				</li>
			</ul>
		</li>
	</ul>
</header>
<slot />
<footer>
	<div>
		Font made from
		<a href="http://www.onlinewebfonts.com">Online Web Fonts</a> is licensed by CC BY 3.0
	</div>
</footer>

<style>
	header * {
		grid-area: header;
		color: var(--color-secondary);
	}

	header > ul:first-child {
		display: flex;
		align-items: center;
		justify-content: start;
	}

	.headerItem {
		padding-left: 40px;
	}

	.social {
		margin-right: 10px;
		margin-left: auto;
	}

	.social ul {
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.socialItem {
		padding: 10px;
	}

	footer {
		grid-area: footer;
	}
</style>
