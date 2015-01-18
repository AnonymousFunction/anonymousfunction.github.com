describe("Enemy Maps", function () {
    beforeEach(function () {

    });

    describe("Enemy animation", function () {
        it("generates random directions up, down, left, and right", function () {
            for (var i = 0; i < 10; i++) {
                var randomDirection = getRandomDirection();
                var isUDLF = randomDirection === "up" || randomDirection === "down" || randomDirection === "left" ||randomDirection === "right";
                expect(isUDLF).toBe(true);
            }
        });
    });
});

