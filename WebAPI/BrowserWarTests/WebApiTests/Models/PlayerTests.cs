using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAPI.Models;

namespace BrowserWarTests.WebApiTests.Models
{
    public class PlayerTests
    {
        [Test]
        public void IsNickValidShouldPass()
        {
            Assert.IsTrue(Player.IsNickValid("C123"));
        }

        [Test]
        public void IsNickValidShoulFail_TooShort()
        {
            Assert.IsFalse(Player.IsNickValid("C23"));
        }

        [Test]
        public void IsNickValidShoulFail_TooLong()
        {
            Assert.IsFalse(Player.IsNickValid("C012345678901234"));
        }

        [Test]
        public void IsNickValidShoulFail_ShouldStartWithCharacter()
        {
            Assert.IsFalse(Player.IsNickValid("0123456789"));
        }

        [Test]
        public void IsNickValidShoulFail_ShouldNotHaveSpecChars()
        {
            Assert.IsFalse(Player.IsNickValid("01234_"));
        }
    }
}
