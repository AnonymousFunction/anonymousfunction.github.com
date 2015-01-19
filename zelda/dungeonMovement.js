var currentDungeonMap;
var currentDungeonMapX;
var currentDungeonMapY;

//default all maps
for (var x=0; x<16; x++){
    for (var y=0; y<16; y++) {
        window["dm_" + x + "_" + y] = [];
    }
}

var dm_3_7 =  [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
];

var movementDungeonMap = [
    [dm_0_0,dm_1_0,dm_2_0,dm_3_0,dm_4_0,dm_5_0,dm_6_0,dm_7_0,dm_8_0,dm_9_0,dm_10_0,dm_11_0,dm_12_0,dm_13_0,dm_14_0,dm_15_0],
    [dm_0_1,dm_1_1,dm_2_1,dm_3_1,dm_4_1,dm_5_1,dm_6_1,dm_7_1,dm_8_1,dm_9_1,dm_10_1,dm_11_1,dm_12_1,dm_13_1,dm_14_1,dm_15_1],
    [dm_0_2,dm_1_2,dm_2_2,dm_3_2,dm_4_2,dm_5_2,dm_6_2,dm_7_2,dm_8_2,dm_9_2,dm_10_2,dm_11_2,dm_12_2,dm_13_2,dm_14_2,dm_15_2],
    [dm_0_3,dm_1_3,dm_2_3,dm_3_3,dm_4_3,dm_5_3,dm_6_3,dm_7_3,dm_8_3,dm_9_3,dm_10_3,dm_11_3,dm_12_3,dm_13_3,dm_14_3,dm_15_3],
    [dm_0_4,dm_1_4,dm_2_4,dm_3_4,dm_4_4,dm_5_4,dm_6_4,dm_7_4,dm_8_4,dm_9_4,dm_10_4,dm_11_4,dm_12_4,dm_13_4,dm_14_4,dm_15_4],
    [dm_0_5,dm_1_5,dm_2_5,dm_3_5,dm_4_5,dm_5_5,dm_6_5,dm_7_5,dm_8_5,dm_9_5,dm_10_5,dm_11_5,dm_12_5,dm_13_5,dm_14_5,dm_15_5],
    [dm_0_6,dm_1_6,dm_2_6,dm_3_6,dm_4_6,dm_5_6,dm_6_6,dm_7_6,dm_8_6,dm_9_6,dm_10_6,dm_11_6,dm_12_6,dm_13_6,dm_14_6,dm_15_6],
    [dm_0_7,dm_1_7,dm_2_7,dm_3_7,dm_4_7,dm_5_7,dm_6_7,dm_7_7,dm_8_7,dm_9_7,dm_10_7,dm_11_7,dm_12_7,dm_13_7,dm_14_7,dm_15_7],
    [dm_0_8,dm_1_8,dm_2_8,dm_3_8,dm_4_8,dm_5_8,dm_6_8,dm_7_8,dm_8_8,dm_9_8,dm_10_8,dm_11_8,dm_12_8,dm_13_8,dm_14_8,dm_15_8],
    [dm_0_9,dm_1_9,dm_2_9,dm_3_9,dm_4_9,dm_5_9,dm_6_9,dm_7_9,dm_8_9,dm_9_9,dm_10_9,dm_11_9,dm_12_9,dm_13_9,dm_14_9,dm_15_9],
    [dm_0_10,dm_1_10,dm_2_10,dm_3_10,dm_4_10,dm_5_10,dm_6_10,dm_7_10,dm_8_10,dm_9_10,dm_10_10,dm_11_10,dm_12_10,dm_13_10,dm_14_10,dm_15_10],
    [dm_0_11,dm_1_11,dm_2_11,dm_3_11,dm_4_11,dm_5_11,dm_6_11,dm_7_11,dm_8_11,dm_9_11,dm_10_11,dm_11_11,dm_12_11,dm_13_11,dm_14_11,dm_15_11],
    [dm_0_12,dm_1_12,dm_2_12,dm_3_12,dm_4_12,dm_5_12,dm_6_12,dm_7_12,dm_8_12,dm_9_12,dm_10_12,dm_11_12,dm_12_12,dm_13_12,dm_14_12,dm_15_12],
    [dm_0_13,dm_1_13,dm_2_13,dm_3_13,dm_4_13,dm_5_13,dm_6_13,dm_7_13,dm_8_13,dm_9_13,dm_10_13,dm_11_13,dm_12_13,dm_13_13,dm_14_13,dm_15_13],
    [dm_0_14,dm_1_14,dm_2_14,dm_3_14,dm_4_14,dm_5_14,dm_6_14,dm_7_14,dm_8_14,dm_9_14,dm_10_14,dm_11_14,dm_12_14,dm_13_14,dm_14_14,dm_15_14],
    [dm_0_15,dm_1_15,dm_2_15,dm_3_15,dm_4_15,dm_5_15,dm_6_15,dm_7_15,dm_8_15,dm_9_15,dm_10_15,dm_11_15,dm_12_15,dm_13_15,dm_14_15,dm_15_15]
];

var setCurrentDungeonMap = function(x, y){
    if (x != currentDungeonMapX || y != currentDungeonMapY) {
        //backwards because I'm treating the first index as down the screen/map to make it more readable
        console.log("map move");
        currentDungeonMapX = x;
        currentDungeonMapY = y;
        currentDungeonMap = movementDungeonMap[y][x];
//        setCurrentEnemyMap(x, y);
        drawCurrentDungeonMapBuilder(x, y);
    }
};

setCurrentMap(7,7);