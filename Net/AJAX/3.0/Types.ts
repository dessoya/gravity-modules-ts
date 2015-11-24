
export interface Callback {
	(err: any, result: any): void;
}

export interface Props {
	url: string;
	get?: string;
	post?: string | Object;
}

export interface Result {

	answer: string|Object;

	skip_callback?: boolean;
	error?: any;
	headers?: any;
}
 