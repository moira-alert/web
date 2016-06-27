export interface IPagingScope{
	total: number;
	page: number;
	size: number;
	pages: Array<number>;
}

export function InitPagesList(scope: IPagingScope) {
	scope.pages = new Array();
	for(var i = scope.page - 5; i < scope.page + 10; i++){
		if(i < 0){
			continue;
		}
		scope.pages.push(i);
		if(scope.pages.length == 10 || (i + 1) * scope.size >= scope.total){
			break;
		}
	}
}