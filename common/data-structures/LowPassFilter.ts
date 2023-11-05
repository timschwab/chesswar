// From https://stackoverflow.com/a/5111475/1455074

export class LowPassFilter {
	private readonly strength: number;
	private value = 0;

	constructor(strength: number) {
		this.strength = strength;
	}

	set(value: number): void {
		const diff = value - this.value;
		const adjusted = diff/this.strength;
		this.value += adjusted;
	}

	read(): number {
		return this.value;
	}
}