export class CkoFrames {
	Frames: any;
	config: any;

	constructor(config: any) {
		let myWindowObject = window as any;
		this.Frames = myWindowObject.Frames as any;
		this.config = config;
	}

	init() {
		this.Frames.init(this.config);
	}

	getFrames() {
		return this.Frames;
	}

	async getTokenisedCard() {
		return this.Frames.submitCard();
	}
}
