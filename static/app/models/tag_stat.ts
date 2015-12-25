import {ITagData} from './tag';
import {ISubscriptionJson} from './subscription';

export interface ITagStat {
	data: ITagData,
	name: string;
	subscriptions: Array<ISubscriptionJson>,
	triggers: Array<string>
}
