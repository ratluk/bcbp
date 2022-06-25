/*  This script implements IATA standards on parsing the contents of the barcode boarding pass, using the implementation guide which is publically available.
    (https://www.iata.org/contentassets/1dccc9ed041b4f3bbdcf8ee8682e75c4/2021_03_02-bcbp-implementation-guide-version-7-.pdf, https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.iata.org%2Fcontentassets%2F04c5400c2dcd4b05a520330672b13ef6%2Fiata-passenger-glossary-of-terms.xlsx&wdOrigin=BROWSELINK)
*/

function getTitle(name){
    let m = name.match(/ MRS| MR| MSTR| DR| MISS| MS/g) || "N/A";

    switch (m[0]) {
        case " MRS":
            return {
                type: "MRS",
                sex: "F",
                age: "adult",
                description: ""
            }
        case " MR":
            return {
                type: "MR",
                sex: "M",
                age: "adult",
                description: ""
            }
        case " MSTR":
            return {
                type: "MSTR",
                sex: "M",
                age: "child",
                description: ""
            }
        case " DR":
            return {
                type: "DR",
                sex: "N/A",
                age: "adult",
                description: "DR/PHD"
            }
        case " MISS":
            return {
                type: "MISS",
                sex: "F",
                age: "child",
                description: ""
            }
        case " MS":
            return {
                type: "MS",
                sex: "F",
                age: "adult",
                description: ""
            }
        default:
            return "N/A";
    }
}

function getName(passengerName){
    return {
        first:  (() => {
            let n = passengerName.slice(0,21).split("/")[1].trim();
            return n.replace(/ MRS| MR| MSTR| DR| MISS| MS/i, "")
        })(),
        last:   passengerName.slice(0,21).split("/")[0].split(" ")[0].trim(),
        title:  getTitle(passengerName.slice(2,21).split("/")[1])
    }
}

function getYear(current, dateOfIssue){
    /* Date of issue is given in form of 0365, ie.
    the first number is the last digit of the year of issue
    and the next three are days elapsed since the start of the year.
    
    Under assumption that boarding pass was just recently issued,
    if the current year of the current decade is a number bigger
    than the first digit of dateOfIssue, then we assume that the
    pass was issued in recent past.

    If the current year of the current decade is a number smaller
    than the first digit of dateOfIssue, then we assume the boarding pass
    was issued in the previous decade.
    
    Eg, If the year is 2022, 9121 means that the boarding pass was
    probably issued on May 1, 2019.
    
    Otherwise, if the two numbers match, then return current year. */

    let year = Array.from(String(current));

    if(!Number(dateOfIssue)){
        year = Array.from(String(current));
    }
    else if(Number(String(current)[3]) > Number(String(dateOfIssue)[0])){
        year[3] = String(dateOfIssue[0])
    }
    else if(Number(String(current)[3]) < Number(String(dateOfIssue)[0])){
        year[3] = String(dateOfIssue[0])
        year[2] = Number(year[2])-1
    }
    else if(Number(String(current)[3]) == Number(String(dateOfIssue)[0])){
        year = Array.from(String(current));
    }
    else{
        year = Array.from(String(current));
    }
    
    return Number(year.join(""));

}

function getDate(days, encoded){
    /* BCBP date is encoded in form of days elapsed since the start of the year.
       So a date in form of 46 is FEB 15, or 124 is MAY 4 etc.
       This assumes the input year is the current year. */
    const currentYear = new Date().getFullYear();
    const flightYear = getYear(currentYear, encoded.slice(67,71));
    const flightDate = new Date(flightYear, 0, Number(days));
    return flightDate;
}

function getCompartment(fareCode){
    /*  F, A -- First class
        J, C, D, I, R -- Business class
        W, E, T -- Premium economy class
        Y, B, H, K, L, M, N, S, V, G, O, Q -- economy class */
    if(fareCode.match(/F|A/g)){return "First"}
    else if(fareCode.match(/J|C|D|I|R/g)){return "Business"}
    else if(fareCode.match(/W|E|T/g)){return "Premium Economy"}
    else if(fareCode.match(/Y|B|H|K|L|M|N|S|V|G|O|Q/g)){return "Economy"}
    else { return "N/A" }
}

function getClass(code){
    return {
        compartmentCode: code,
        compartmentType: getCompartment(code)
        }
    }

function getRouteData(encoding){
    let legsEncoded = Number(encoding.slice(1,2));
         // Return for multiple legs encoded
    let offset = 132;
    let routeData = [
        {
            legEncoded: 1,
            operatingCarrierPNRCode: encoding.slice(23,30).trim(),
            originAirportCode: encoding.slice(30,33),
            destinationAirportCode: encoding.slice(33,36),
            operatingCarrierDesignator: encoding.slice(36,39).trim(),
            flightNumber: encoding.slice(39,44).trim(),
            dateOfFlight: getDate(encoding.slice(44,47), encoding),
            compartment: getClass(encoding.slice(47,48)),
            seatNumber: encoding.slice(48,52),
            checkinSequenceNumber: encoding.slice(52,57).trim(),
            passengerStatus: encoding.slice(57,58)
        }];

        if(legsEncoded > 1){
            
            for(let i=1; i<legsEncoded; i++){
                routeData.push({
                    legEncoded: i+1,
                    operatingCarrierPNRCode: encoding.slice(offset,offset+7).trim(),
                    originAirportCode: encoding.slice(offset+7,offset+10),
                    destinationAirportCode: encoding.slice(offset+10,offset+13),
                    operatingCarrierDesignator: encoding.slice(offset+13,offset+16).trim(),
                    flightNumber: encoding.slice(offset+16,offset+21).trim(),
                    dateOfFlight: getDate(encoding.slice(offset+21,offset+24), encoding),
                    compartment: getClass(encoding.slice(offset+24,offset+25)),
                    seatNumber: encoding.slice(offset+25,offset+29),
                    checkinSequenceNumber: encoding.slice(offset+29,offset+34).trim(),
                    passengerStatus: encoding.slice(offset+34,offset+35)
                })
                offset += 81;
        }
    }
        /* For multiple flights in one bcbp, flights from #2 onwards
        are encoded in segments of 81 characters in length,
        132 char set off from the start, excluding the first leg.
        So the first leg is manually parsed and the data for
        every other leg is extracted by running a loop shifting
        the focus area by 81 characters for the next segment/leg
        for each other leg encoded. */
        
        return routeData;
}

function decode(encoding){

    return {
        legsEncoded: encoding.slice(1,2),
        name: getName(encoding.slice(2,21)),
        flightSegments: getRouteData(encoding),

    };
}

exports.decode = decode;