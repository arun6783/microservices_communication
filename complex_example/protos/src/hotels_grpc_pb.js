// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var src_hotels_pb = require('../src/hotels_pb.js');

function serialize_Hotels_GetHotelRequest(arg) {
  if (!(arg instanceof src_hotels_pb.GetHotelRequest)) {
    throw new Error('Expected argument of type Hotels.GetHotelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Hotels_GetHotelRequest(buffer_arg) {
  return src_hotels_pb.GetHotelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Hotels_HotelResponse(arg) {
  if (!(arg instanceof src_hotels_pb.HotelResponse)) {
    throw new Error('Expected argument of type Hotels.HotelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Hotels_HotelResponse(buffer_arg) {
  return src_hotels_pb.HotelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HotelsService = exports.HotelsService = {
  getHotels: {
    path: '/Hotels.Hotels/getHotels',
    requestStream: false,
    responseStream: false,
    requestType: src_hotels_pb.GetHotelRequest,
    responseType: src_hotels_pb.HotelResponse,
    requestSerialize: serialize_Hotels_GetHotelRequest,
    requestDeserialize: deserialize_Hotels_GetHotelRequest,
    responseSerialize: serialize_Hotels_HotelResponse,
    responseDeserialize: deserialize_Hotels_HotelResponse,
  },
};

exports.HotelsClient = grpc.makeGenericClientConstructor(HotelsService);
