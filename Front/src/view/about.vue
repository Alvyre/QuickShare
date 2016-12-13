<template>
	<div id="about">
		<div class="row row-centered">
			<div class="col-xs-12 col-sm-12">
				<h3>About</h3>		
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row row-centered">
			<div class="col-xs-12 col-sm-12">
				<div class="well FAQ">
					<h4><u>What is QuickShare?</u></h4>
					<p>QuickShare is the result of a research project made by Romain François in the laboratory of the Pr. Sumi Yasuyuki.</p><br>
					<h4><u>What is the objective?</u></h4>
					<p>The objective is to offer a new system to share simply and instantly information between students in FUN. Moreover, this system tries to bring students closer in the university: you will probably meet student you don't know by using this application.</p><br>
					<h4><u>How to use this system?</u></h4>
					<p><strong>It's very simple!</strong><br>
					When you arrive on the default page, which is the homepage, you can see all the current information. To interact with other students, create information or join events you have to create an account. You can register by navigate into "Sign-up" in the menu.</p>
					<p>When you're logged, you can vote up/down information, "up" if you find them usefull, and "down" if you find them useless. This feature allows us to select and show pertinent information for the whole community !</p>
					<p>You can also watch closer information by clicking on it. You will arrive on a detailed page of the information you selected. If it is an event, you will be able to join or leave it. If you are the owner (creator), you will be able to manage and modify it.</p>
					<p>You can modify your personal information in your profile page. You can also delete your account, but be carefull! This action is definitive!</p>
					<p>To add an info, just click on the "add info" button, and fill-up the form. When you finished, just submit and it's done!</p><br>
					<h4><u>I found a bug, how can I report it?</u></h4>
					<p>We are very sorry to hear that! :(</p>
					<p>To report a bug or an issue, please refer to contact page.</p><br>
					<h4><u>I have a question, where can I ask it?</u></h4>
					<p>You can ask us anything by the form in the contact page. We will try to answer as soon as possible!</p>
				</div>
				<div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
					<router-link to="/contact">
						<button type="button" class="btn btn-large btn-block btn-default">Contact</button>
					</router-link>	
				</div>
				
			</div>
		</div>
		
	</div>
</template>

<script>

//Imports
//====================================


//Vue
//====================================

	export default {
		name: 'about',
		data () {
			return {

			}
		},
		mounted () {},
		methods: {},
		computed: {}
	}

</script>

<style>
	.FAQ {
		text-align: left;
	}
</style>