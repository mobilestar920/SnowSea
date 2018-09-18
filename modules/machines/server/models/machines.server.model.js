'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var MachineSchema = new Schema({
  user: {
    type: String,
    default: '',
    unique: true
  },
  host: {
    type: String,
    default: '',
    unique: true
  },
  updated: {
    type: Number,
    default: Date.now
  },
  info: {
    allowed: Number,
    overheat: Number,
    pool_info: String,
    kernel: String,
    uptime: Number,
    mac: String,
    hostname: String,
    rack_loc: String,
    ip: String,
    group: String,
    mobo: String,
    lan_chip: String,
    load: String,
    ram: String,
    cpu_temp: String,
    cpu_name: String,
    rofs: Number,
    drive_name: String,
    freespace: Number,
    temp: String,
    version: Number,
    miner_secs: Number,
    adl_error: String,
    proxy_problem: String,
    updating: String,
    connected_displays: String,
    resolution: String,
    config_error: String,
    send_remote: String,
    alive: Number,
    driver: String,
    wrong_driver: String,
    gpus: Number,
    fanrpm: String,
    fanpercent: String,
    hash: Number,
    miner: String,
    miner_hashes: String,
    models: String,
    bioses: String,
    default_core: String,
    default_mem: String,
    core: String,
    mem: String,
    meminfo: String,
    voltage: String,
    overheatedgpu: String,
    throttled: String,
    powertune: String,
    miner_log: String
  }
});

mongoose.model('Machine', MachineSchema);
