import {IConfigJson} from '../app/models/config';

export var config: IConfigJson =
	{
		api_url: "/",
		contacts: [
			{ type: "email", validation: "^.+@.+\\..+$", icon: "email", title: "", img: "" },
			{ type: "phone", validation: "^9\\d{9}$", icon: "phone", title: "phone +7", img: "" },
			{ type: "pushover", validation: "", img: "pushover.ico", icon: "", title: "" },
			{ type: "slack", validation: "^[@#].+$", img: "slack.ico", icon: "", title: "" }
		]
	}