﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class MapDescription
    {
        public MapDescription(DAL.Map map, string ownerNick)
        {
            MapId = map.Id;
            MapName = map.Name;
            OwnerId = map.OwnerId;
            OwnerNick = ownerNick;
            Published = map.Published;
        }

        public int MapId { get; set; }

        public string MapName { get; set; }

        public int OwnerId { get; set; }

        public string OwnerNick { get; set; }

        public byte Published { get; set; }
    }
}
