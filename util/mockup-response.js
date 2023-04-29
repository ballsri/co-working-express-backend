// mockup string response handler
const mockupfunc = (prompt) => {
    return (req, res) => {
        res.send(prompt);
    }
}
// delete this afterwards

exports.mockupfunc = mockupfunc;