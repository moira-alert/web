import {IStringId, UniqList} from '../models/core';

export interface IFilter<T extends IStringId>{
	value:string;
	open:boolean;
	filtered:UniqList<T>;
	items_hidden:number;
	selection:UniqList<T>;
}
