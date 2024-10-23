const mongoose = require("mongoose");
const { connectToDatabase } = require("../../src/db/db.js");

jest.mock("mongoose", () => ({
    connect: jest.fn(),
    }));

    describe("connecting to Database", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("throws an error when MONGODB_URL is not provided", async () => {
        process.env.MONGODB_URL = "";
        await expect(connectToDatabase()).rejects.toThrow("No connection string provided");
        expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it("calls mongoose.connect with the correct URL", async () => {
        const mockUrl = "mongodb://localhost:27017/testdb";
        process.env.MONGODB_URL = mockUrl;
        await connectToDatabase();
        expect(mongoose.connect).toHaveBeenCalledWith(mockUrl);
    });

    it("logs a success message when not in test environment", async () => {
        process.env.MONGODB_URL = "mongodb://localhost:27017/testdb";
        process.env.NODE_ENV = "development";
        console.log = jest.fn();
        await connectToDatabase();
        expect(console.log).toHaveBeenCalledWith("Successfully connected to MongoDB");
    });

    it("does not log a success message in test environment", async () => {
        process.env.MONGODB_URL = "mongodb://localhost:27017/testdb";
        process.env.NODE_ENV = "test";
        console.log = jest.fn();
        await connectToDatabase();
        expect(console.log).not.toHaveBeenCalled();
    });
});
