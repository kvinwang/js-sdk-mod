"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpec = void 0;
function getSpec(chain) {
    return __awaiter(this, void 0, void 0, function* () {
        // We don't want API users to be able to `import` a file outside of the `generated` directory.
        // While it is probably harmless, better be safe than sorry.
        // This is done by make sure that the name doesn't contain `..`. This also means that we can't
        // support well-known chain whose name contains `..`, but that seems unlikely to ever be
        // problematic.
        if (chain.indexOf("..") !== -1)
            throw new Error("Invalid chain name");
        try {
            const specRaw = (yield Promise.resolve().then(() => __importStar(require("./generated/" + chain + ".js"))));
            return typeof specRaw === "string"
                ? specRaw
                : specRaw.default;
        }
        catch (error) {
            throw new Error("Invalid chain name");
        }
    });
}
exports.getSpec = getSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29ubmVjdG9yL3NwZWNzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBc0IsT0FBTyxDQUFDLEtBQWE7O1FBQ3pDLDhGQUE4RjtRQUM5Riw0REFBNEQ7UUFDNUQsOEZBQThGO1FBQzlGLHdGQUF3RjtRQUN4RixlQUFlO1FBQ2YsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUVyRSxJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUcsQ0FBQyx3REFBYSxjQUFjLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBQyxDQUV0QyxDQUFBO1lBRXZCLE9BQU8sT0FBTyxPQUFPLEtBQUssUUFBUTtnQkFDaEMsQ0FBQyxDQUFDLE9BQU87Z0JBQ1QsQ0FBQyxDQUFFLE9BQTBDLENBQUMsT0FBTyxDQUFBO1NBQ3hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7U0FDdEM7SUFDSCxDQUFDO0NBQUE7QUFuQkQsMEJBbUJDIn0=