var vote = {
	hasVoted (info, userID) {
		return info.votelist.indexOf(userID);
	},
	voteUp(info, userID) {
		//case 1: the user already voted, we updated his vote
		if( hasVoted(userID != -1) ) {

		}
		// case 2: the user entered a new vote
		else {

		}

	}
}