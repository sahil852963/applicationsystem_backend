export const convertUTCToISTDateOnly = (input) => {
	const convertOne = (utcDate) => {
		const d = new Date(utcDate);
		d.setMinutes(d.getMinutes() + 330); 
		return d.toISOString().split("T")[0];
	};

	if (Array.isArray(input)) {
		return input.map(convertOne);
	}

	return convertOne(input);
};
