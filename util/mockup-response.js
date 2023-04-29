// mockup string response handler
export const mockupfunc = (prompt) => {
    return (req, res) => {
        res.send(prompt);
    }
}
// delete this afterwards

const router = express.Router();