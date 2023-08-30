type RotationInteraction = {
	min: number,
	max: number
 }

  type InteractionsMap = {
	[object: string] : {
		rotation? : RotationInteraction
	}
  }