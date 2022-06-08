## IATA Bar coded boarding pass decoding tool

This script implements IATA standards on parsing the contents of the barcode boarding pass, using the [implementation guide](https://www.iata.org/contentassets/1dccc9ed041b4f3bbdcf8ee8682e75c4/2021_03_02-bcbp-implementation-guide-version-7-.pdf).

## Usage

Decoder needs to be fed the appropriately formatted string. This can be derived by scanning the PDF417 standard barcode on a boarding pass.

```js
decode("M1RATIC/LUKA MR       EEMBLOC BEGAMSJU 0360 251Y010F0075 162>5321OO9251BJU                                        2A1152121397542 0                          N")
```

```json
{
    "legsEncoded": "1",
    "name": {
        "first": "LUKA",
        "last": "RATIC",
        "title": {
            "type": "MR",
            "sex": "M",
            "age": "adult",
            "description": ""
        }
    },
    "flightSegments": [
        {
            "legEncoded": 1,
            "operatingCarrierPNRCode": "EMBLOC",
            "originAirportCode": "BEG",
            "destinationAirportCode": "AMS",
            "operatingCarrierDesignator": "JU",
            "flightNumber": "0360",
            "dateOfFlight": "2019-09-07T22:00:00.000Z",
            "compartment": {
                "compartmentCode": "Y",
                "compartmentType": "Economy"
            },
            "seatNumber": "010F",
            "checkinSequenceNumber": "0075",
            "passengerStatus": "1"
        }
    ]
}
```

Example for multiple flight legs encoded in one boarding pass

```js
decode("M2RATIC/LUKA          E8X1CVJ BEGCDGJU 0310 092Y013A0020 348>5180OO7092B1A              2A13123004914330                           N8X1CVJ CDGNRTAF 0276 092Y028A0039 32C2A13123004914330                           N")
```

```json
{
    "legsEncoded": "2",
    "name": {
        "first": "LUKA",
        "last": "RATIC",
        "title": "N/A"
    },
    "flightSegments": [
        {
            "legEncoded": 1,
            "operatingCarrierPNRCode": "8X1CVJ",
            "originAirportCode": "BEG",
            "destinationAirportCode": "CDG",
            "operatingCarrierDesignator": "JU",
            "flightNumber": "0310",
            "dateOfFlight": "2017-04-01T22:00:00.000Z",
            "compartment": {
                "compartmentCode": "Y",
                "compartmentType": "Economy"
            },
            "seatNumber": "013A",
            "checkinSequenceNumber": "0020",
            "passengerStatus": "3"
        },
        {
            "legEncoded": 2,
            "operatingCarrierPNRCode": "8X1CVJ",
            "originAirportCode": "CDG",
            "destinationAirportCode": "NRT",
            "operatingCarrierDesignator": "AF",
            "flightNumber": "0276",
            "dateOfFlight": "2017-04-01T22:00:00.000Z",
            "compartment": {
                "compartmentCode": "Y",
                "compartmentType": "Economy"
            },
            "seatNumber": "028A",
            "checkinSequenceNumber": "0039",
            "passengerStatus": "3"
        }
    ]
}
```