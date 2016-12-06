<template>
	<div id="contact">
		<div class="row row-centered">
			<div class="col-xs-12 col-sm-12">
				<h3>Contact</h3>
				<div class="well">
					Any suggestions or wanting to report a bug?<br>You are in the right place!
				</div>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row row-centered">
			<div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
				<a class="btn btn-primary" href="mailto:Sharinfo@romainfrancois.fr?subject=SharInfo contact" role="">Send e-mail</a>
			</div>
		</div>
	</div>
</template>

<script>
	//Import
	//==================================


	//Vue
	//==================================

	export default {
		name: 'contact',
		data () {
			return {
				formData: {
					name: '',
					email: '',
					message: ''
				}
			}
		},
		methods: {

		}
	}
</script>