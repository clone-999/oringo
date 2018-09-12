const calculateFare = (baseFare, timeRate, time, distanceRate, distance, surge, subscriptionType)=>{
	const distanceInKm = distance * 0.001;
	//const timeInMin = time * 0.0166667;
	//const pricePerKm = timeRate * timeInMin;
	//const pricePerMinute = distanceRate * distanceInKm;
	//const totalFare = (baseFare + pricePerKm + pricePerMinute) * surge;
	const ttlfr = baseFare * distanceInKm;
	const totalpc = ttlfr * 15 / 100;
	const totalrc = (ttlfr + totalpc) * 2;
	const totalFare = totalrc * subscriptionType;
	return Math.round(totalFare);
};

export default calculateFare;
