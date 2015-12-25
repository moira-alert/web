import {Pattern} from '../models/pattern';
import {Api} from '../services/api';

interface IPatternsScope extends ng.IScope {
	patterns: Array<Pattern>;
	show_pattern: Pattern;
}

export class PatternsController {

	static $inject = ['$scope', 'api'];

	constructor(private $scope: IPatternsScope, private api: Api) {
		api.tag.list().then((tags) => {
			return api.pattern.list().then((data) => {
				$scope.patterns = [];
				angular.forEach(data.list, function(item) {
					$scope.patterns.push(new Pattern(item, tags));
				});
			});
		});
	}
	
	show(pattern:Pattern){
		if(this.$scope.show_pattern == pattern)
			this.$scope.show_pattern = null;
		else
			this.$scope.show_pattern = pattern;
	}

	delete(pattern: Pattern) {
		this.api.pattern.delete(pattern.pattern).then(() => {
			pattern.deleted = true;
			this.$scope.show_pattern = null;
		});
	};
}
