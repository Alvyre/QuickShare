<template>
	<div id="footer-vue">
		<footer v-if="!loading">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12">
					Sharinfo ©2016-2017
				</div>
			</div>		
		</footer>
	</div>
</template>


<script>
	import Store from '../store';

	export default {
		name: 'footer-vue',
		data () {
			return {
			}
		},
		computed: {
			loading () {
				return Store.state.loading;
			}
		}
	}
</script>

<style>
#footer-vue{
	margin-top: 20px;
}
	
</style>