<template>
	<div id="infoLoader">
		<div class="panel" :class="setClass">
		<div class="panel-heading">
			<span>{{content.title}}</span>
		</div>
		<div class="panel-body">
			<label v-if='content.description'>Description:</label>
			<p>{{content.description}}</p>
			<p v-if='content.category == "Event"'> From: {{content.birthdate}} <br> to: 	{{content.expirydate}}
			</p>
			<p>
				<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>: {{content.location}} <br>
				{{content.addInfo}}
			</p>
			<hr>
			<footer>
				<div class="right">
					<button type="button" class="btn btn-xs btn-success">
						<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
					</button>
					<span>{{content.vote}}</span>
					<button type="button" class="btn btn-xs btn-danger">
						<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
					</button>
				</div>
				
			</footer>
		</div>
	</div>
	
</template>
	
<script>
	export default {
		name: 'infoLoader',
		props: {
			type: 		{ type: String, default: ''},
			content: 	{ type: Object, default: {}}
		},
		data () {
			return {

			}
		},
		computed: {
			setClass () {
				switch(this.type) {
					case 'Info':
					return 'panel-info';
					break;
					case 'Event':
					return 'panel-success';
					break;
					case 'Help':
					return 'panel-warning';
					break;
					default:
					return '';
					break;
				}
			}
		},
		methods: {

		},
		filters: {
			formatDate (date) {
				//return moment(date, 'YYYY-MM-DD' );
			}
		}
	}
</script>


	

});