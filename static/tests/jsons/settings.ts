export var settings = {
	login: "username",
	contacts: [
		{
			type: "email",
			user: "username",
			value: "username@test.com",
			id: "7ac7189c-5250-4e2d-8b4a-241198da1ba5"
		},
		{
			type: "phone",
			user: "username",
			value: "+7123456789",
			id: "618a2996-e26b-4cd2-a274-ec8e60249845"
		}
	],
	subscriptions: [
		{
			id: "a3581005-c289-4dea-bd8e-77b8fc23a3e3",
			user: "username",
			tags: ["EXCEPTION"],
			enabled: true,
			contacts: ["7ac7189c-5250-4e2d-8b4a-241198da1ba5", "618a2996-e26b-4cd2-a274-ec8e60249845"]
		},
		{
			id: "89a84752-06d4-476e-aea6-8a0a8197cb5d",
			user: "username",
			tags: ["DevOps"],
			enabled: false,
			contacts: ["7ac7189c-5250-4e2d-8b4a-241198da1ba5", "non_existing"]
		}
	]
}