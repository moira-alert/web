import {Trigger} from '../models/trigger';

export interface ITriggerDownload extends ng.IScope{
    trigger: Trigger;
}

export function TriggerDownload($parse: ng.IParseService): ng.IDirective{
    return {
        restrict: 'A',
        scope: {
            trigger: "=triggerDownload"
        },
        link: function (scope: ITriggerDownload, element, attributes) {
            element.bind("click", function (event) {
                event.currentTarget.href = scope.trigger.get_json_content();
            });
        }
    }
}

TriggerDownload.$inject = ['$parse'];