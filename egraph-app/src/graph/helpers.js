class Coordinates {
    constructor(x, y) {
        this.x_ = x;
        this.y_ = y;
    }
    ComputeDistanceTo(another) {
        return Math.sqrt(Math.pow(this.x_ - another.x_, 2) + Math.pow(this.y_ - another.y_, 2));
    }
}


function generate_uuid_v4() {
    const dis = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const dis2 = dis(8, 11);
    const ss = [];
    for (let i = 0; i < 8; i++) {
        ss.push(dis(0, 15));
    }
    ss.push("-");
    for (let i = 0; i < 4; i++) {
        ss.push(dis(0, 15));
    }
    ss.push("-4");
    for (let i = 0; i < 3; i++) {
        ss.push(dis(0, 15));
    }
    ss.push("-");
    ss.push(dis2);
    for (let i = 0; i < 3; i++) {
        ss.push(dis(0, 15));
    }
    ss.push("-");
    for (let i = 0; i < 12; i++) {
        ss.push(dis(0, 15));
    }
    return ss.join("");
}

export {Coordinates, generate_uuid_v4};
