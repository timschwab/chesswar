// From https://stackoverflow.com/a/5111475/1455074

export class LowPassFilter {
	private readonly strength: number;
	private value: number;

	constructor(strength: number, initialValue?: number) {
		this.value = initialValue || 0;
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