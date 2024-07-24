//値の精度
const round = Math.pow(10, 12)
function nearSame(a, b) {
    a++; b++;
    while (a < round && a > 0) { a = a * 10; }
    while (b < round && b > 0) { b = b * 10; }
    return Math.floor(a) == Math.floor(b)
}

export class Vec2d {
    x;
    y;
    constructor(x, y) {
        if (x == undefined) {
            this.x = 0;
            this.y = 0;
        } else if (y == undefined) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    set(x, y) {
        if (y == undefined) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    rotate(angleRad) {
        let _x = this.x;
        let _y = this.y;
        this.x = _x * Math.cos(angleRad) - _y * Math.sin(angleRad);
        this.y = _x * Math.sin(angleRad) + _y * Math.cos(angleRad);
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distance(vec) {
        return Vec2d.Sub(this, vec).length();
    }

    same(x, y) {
        if (y == undefined) {
            return (this.x == x.x && this.y == x.y);
        } else {
            return (this.x == x && this.y == y);
        }
    }
    near_same(x, y) {
        if (y == undefined) {
            return (nearSame(this.x, x.x) && nearSame(this.y, x.y));
        } else {
            return (nearSame(this.x, x) && nearSame(this.y, y));
        }
    }
    add(v) {
        this.x += v.x; this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x; this.y -= v.y;
        return this;
    }



    static Cross(u, v) {
        return u.x * v.y - u.y * v.x;
    }

    static Midpoint(v0, v1) {
        return new Vec2d((v0.x + v1.x) * 0.5, (v0.y + v1.y) * 0.5);
    }

    static InterPoint(v0, v1, alpha) {
        return new Vec2d(v0.x * alpha + v1.x * (1 - alpha), v0.y * alpha + v1.y * (1 - alpha));
    }

    static Sub(v0, v1) {
        return new Vec2d(v0.x - v1.x, v0.y - v1.y);
    }

    static Angle(v0, v1) {
        let arg = Math.sqrt(Math.pow(v0.x * v1.x + v0.y * v1.y, 2) / ((v0.x * v0.x + v0.y * v0.y) * (v1.x * v1.x + v1.y * v1.y)));
        console.log(arg);
        return Math.acos(arg);
    }

    static Cos(v0, v1) {
        return Math.sqrt(Math.pow(v0.x * v1.x + v0.y * v1.y, 2) / ((v0.x * v0.x + v0.y * v0.y) * (v1.x * v1.x + v1.y * v1.y)));
    }

    static Same(x1, y1, x2, y2) {
        return new Vec2d(x1, y1).near_same(x2, y2);
    }

}
