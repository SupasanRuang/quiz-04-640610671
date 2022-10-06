import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }
    //compute DB summary
    const users = readUsersDB();
    let customerCount = 0;
    let adminCount = 0;
    let allMoney = 0.0;
    for (let user of users) {
      if (user.isAdmin === true) {
        adminCount += 1;
      } else {
        customerCount += 1;
        allMoney += user.money;
      }
      //console.log(user.isAdmin, user.money);
    }
    //return response
    return res.json({
      ok: true,
      userCount: customerCount,
      adminCount: adminCount,
      totalMoney: allMoney,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
