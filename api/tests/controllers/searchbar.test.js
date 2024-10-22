const SearchBarController = require('../../src/controllers/searchbar'); 
const Recipe = require('../../src/models/recipe');
const User = require('../../src/models/user');
const { generateToken } = require("../../src/lib/token");

jest.mock('../../src/models/recipe');
jest.mock('../../src/models/user');
jest.mock('../../src/lib/token');

describe('SearchBarController.findUsersAndRecipes', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                searchparam: 'testSearch'
            },
            user_id: '12345'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return recipes, user and token if both exist', async () => {
        Recipe.exists.mockResolvedValue(true);
        User.exists.mockResolvedValue(true);
        Recipe.find.mockResolvedValue([{ title: 'testRecipe' }]);
        User.find.mockResolvedValue([{ username: 'testUser' }]);
        generateToken.mockReturnValue('mockToken');

        await SearchBarController.findUsersAndRecipes(req, res);

        expect(Recipe.exists).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(User.exists).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(Recipe.find).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(User.find).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(generateToken).toHaveBeenCalledWith('12345');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipes: [{ title: 'testRecipe' }],
            user: [{ username: 'testUser' }],
            token: 'mockToken'
        });
    });

    it('should return recipes and token but user as false if user does not exist', async () => {
        Recipe.exists.mockResolvedValue(true);
        User.exists.mockResolvedValue(false);
        Recipe.find.mockResolvedValue([{ title: 'testRecipe' }]);
        generateToken.mockReturnValue('mockToken');

        await SearchBarController.findUsersAndRecipes(req, res);

        expect(Recipe.exists).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(User.exists).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(Recipe.find).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(generateToken).toHaveBeenCalledWith('12345');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipes: [{ title: 'testRecipe' }],
            user: 'false',
            token: 'mockToken'
        });
    });

    it('should return user and token but recipes as false if recipe does not exist', async () => {
        Recipe.exists.mockResolvedValue(false);
        User.exists.mockResolvedValue(true);
        User.find.mockResolvedValue([{ username: 'testUser' }]);
        generateToken.mockReturnValue('mockToken');

        await SearchBarController.findUsersAndRecipes(req, res);

        expect(Recipe.exists).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(User.exists).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(User.find).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(generateToken).toHaveBeenCalledWith('12345');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipes: 'false',
            user: [{ username: 'testUser' }],
            token: 'mockToken'
        });
    });

    it('should return 404 if neither user nor recipe exists', async () => {
        Recipe.exists.mockResolvedValue(false);
        User.exists.mockResolvedValue(false);

        await SearchBarController.findUsersAndRecipes(req, res);

        expect(Recipe.exists).toHaveBeenCalledWith({ title: 'testSearch' });
        expect(User.exists).toHaveBeenCalledWith({ username: 'testSearch' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "search parameters do not exist on the site" });
    }); 

    it('should return 500 if there is a server error during recipe search', async () => {
        Recipe.exists.mockResolvedValue(true);
        User.exists.mockResolvedValue(true);
        Recipe.find.mockRejectedValue(new Error('Server error'));

        await SearchBarController.findUsersAndRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});
