export class GoTo{
	
	constructor(public $location: ng.ILocationService){
		this.$location = $location;
	}
	
	go(path:string){
		this.$location.path(path);
	}
}