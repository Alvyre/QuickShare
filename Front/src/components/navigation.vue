
<template>
	<div id="nav">
		<nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
			<div class="container">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">Sharinfo.io</a>
				</div>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav navbar-right">
						<li><a href="/">Home</a></li>
						<li><a href="/about">About</a></li>
						<li><a href="/contact">Contact</a></li>
						<li v-if="isConnected"><a href="/logout">Logout</a></li>
						<li v-if="!isConnected"><a href="/sign-up">Sign-up</a></li>
						<li v-if="!isConnected"><a href="/sign-in">Login</a></li>
					</ul>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container -->
		</nav>
		</div>
</template>

<script>
	export default {
		name: 'nav',
		props: {
			isConnected: {type: Boolean, default: false}
		},
		data () {
			return {}
		}
	}
</script>

<style>
	.navbar-toggle{
		margin-right: 25px;
	}
</style>
