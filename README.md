## IATA Bar coded boarding pass decoding tool

This script implements IATA standards on parsing the contents of the barcode boarding pass, using the [implementation guide](https://www.iata.org/contentassets/1dccc9ed041b4f3bbdcf8ee8682e75c4/2021_03_02-bcbp-implementation-guide-version-7-.pdf).

## Usage

Decoder needs to be fed the appropriately formatted string. This can be derived by scanning the PDF417 standard barcode on a boarding pass.

`decode("M1RATIC/LUKA MR       EEMBLOC BEGAMSJU 0360 251Y010F0075 162>5321OO9251BJU                                        2A1152121397542 0                          N")`

`
{
    &nbsp;"legsEncoded": "1",
    &nbsp;"name": {
        &nbsp;&nbsp;"first": "LUKA",
        &nbsp;&nbsp;"last": "RATIC",
        &nbsp;&nbsp;"title": {
            &nbsp;&nbsp;&nbsp;"type": "MR",
            &nbsp;&nbsp;&nbsp;"sex": "M",
            &nbsp;&nbsp;&nbsp;"age": "adult",
            &nbsp;&nbsp;&nbsp;"description": ""
        &nbsp;&nbsp;}
    &nbsp;},
    &nbsp;"flightSegments": [
        &nbsp;&nbsp;{
            &nbsp;&nbsp;&nbsp;"legEncoded": 1,
            &nbsp;&nbsp;&nbsp;"operatingCarrierPNRCode": "EMBLOC",
            &nbsp;&nbsp;&nbsp;"originAirportCode": "BEG",
            &nbsp;&nbsp;&nbsp;"destinationAirportCode": "AMS",
            &nbsp;&nbsp;&nbsp;"operatingCarrierDesignator": "JU",
            &nbsp;&nbsp;&nbsp;"flightNumber": "0360",
            &nbsp;&nbsp;&nbsp;"dateOfFlight": "2019-09-07T22:00:00.000Z",
            &nbsp;&nbsp;&nbsp;"compartment": {
                &nbsp;&nbsp;&nbsp;&nbsp;"compartmentCode": "Y",
                &nbsp;&nbsp;&nbsp;&nbsp;"compartmentType": "Economy"
            &nbsp;&nbsp;&nbsp;},
            &nbsp;&nbsp;&nbsp;"seatNumber": "010F",
            &nbsp;&nbsp;&nbsp;"checkinSequenceNumber": "0075",
            &nbsp;&nbsp;&nbsp;"passengerStatus": "1"
        &nbsp;&nbsp;}
    &nbsp;]
}
`

Example for multiple flight legs encoded in one boarding pass

`decode("M2RATIC/LUKA          E8X1CVJ BEGCDGJU 0310 092Y013A0020 348>5180OO7092B1A              2A13123004914330                           N8X1CVJ CDGNRTAF 0276 092Y028A0039 32C2A13123004914330                           N")`

`
{
    &nbsp;"legsEncoded": "2",
    &nbsp;"name": {
        &nbsp;&nbsp;"first": "LUKA",
        &nbsp;&nbsp;"last": "RATIC",
        &nbsp;&nbsp;"title": "N/A"
    &nbsp;},
    &nbsp;"flightSegments": [
        &nbsp;&nbsp;{
            &nbsp;&nbsp;&nbsp;"legEncoded": 1,
            &nbsp;&nbsp;&nbsp;"operatingCarrierPNRCode": "8X1CVJ",
            &nbsp;&nbsp;&nbsp;"originAirportCode": "BEG",
            &nbsp;&nbsp;&nbsp;"destinationAirportCode": "CDG",
            &nbsp;&nbsp;&nbsp;"operatingCarrierDesignator": "JU",
            &nbsp;&nbsp;&nbsp;"flightNumber": "0310",
            &nbsp;&nbsp;&nbsp;"dateOfFlight": "2017-04-01T22:00:00.000Z",
            &nbsp;&nbsp;&nbsp;"compartment": {
                "compartmentCode": "Y",
                "compartmentType": "Economy"
            &nbsp;&nbsp;&nbsp;},
            &nbsp;&nbsp;&nbsp;"seatNumber": "013A",
            &nbsp;&nbsp;&nbsp;"checkinSequenceNumber": "0020",
            &nbsp;&nbsp;&nbsp;"passengerStatus": "3"
        &nbsp;&nbsp;},
        &nbsp;&nbsp;{
            &nbsp;&nbsp;&nbsp;"legEncoded": 2,
            &nbsp;&nbsp;&nbsp;"operatingCarrierPNRCode": "8X1CVJ",
            &nbsp;&nbsp;&nbsp;"originAirportCode": "CDG",
            &nbsp;&nbsp;&nbsp;"destinationAirportCode": "NRT",
            &nbsp;&nbsp;&nbsp;"operatingCarrierDesignator": "AF",
            &nbsp;&nbsp;&nbsp;"flightNumber": "0276",
            &nbsp;&nbsp;&nbsp;"dateOfFlight": "2017-04-01T22:00:00.000Z",
            &nbsp;&nbsp;&nbsp;"compartment": {
                "compartmentCode": "Y",
                "compartmentType": "Economy"
            &nbsp;&nbsp;&nbsp;},
            &nbsp;&nbsp;&nbsp;"seatNumber": "028A",
            &nbsp;&nbsp;&nbsp;"checkinSequenceNumber": "0039",
            &nbsp;&nbsp;&nbsp;"passengerStatus": "3"
        &nbsp;&nbsp;}
    &nbsp;]
}
`